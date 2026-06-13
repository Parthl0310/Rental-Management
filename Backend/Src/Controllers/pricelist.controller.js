import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { PriceList } from "../Models/Pricelist.model.js";

const createPricelist = AsyncHandler(async (req, res) => {
    const {
        name,
        product,
        category,
        rentalPeriod,
        price,
        discountType,
        discountValue,
        customerGroup,
        validFrom,
        validTo,
        isActive,
    } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Name Is Required");
    }
    if (discountValue === undefined || discountValue === null) {
        throw new ApiError(400, "Discount Value Is Required");
    }

    if (validFrom && validTo && new Date(validTo) <= new Date(validFrom)) {
        throw new ApiError(400, "Valid To must be greater than Valid From");
    }

    const pricelist = await PriceList.create({
        name,
        product,
        category,
        rentalPeriod,
        price,
        discountType,
        discountValue,
        customerGroup,
        validFrom,
        validTo,
        isActive,
    });

    if (!pricelist) {
        throw new ApiError(
            500,
            "Something Went Wrong While Creating the PriceList"
        );
    }

    return res
        .status(201)
        .json(new ApiResponse(201, pricelist, "PriceList Is created"));
});

const getAllPricelists = AsyncHandler(async (req, res) => {
  const { isActive } = req.query;

  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const allPricelists = await PriceList.find(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      allPricelists,
      "All Pricelists fetched successfully"
    )
  );
});

const getActivePricelists= AsyncHandler(async(req,res)=>{
    const query={
        isActive:true
    };

    const today=Date.now();
    query.validFrom={
        $lte:today
    }
    query.validTo={
        $gte:today
    }

    const activePriceList=await PriceList.find(query)
    return res.status(200).json(
    new ApiResponse(
      200,
      activePriceList,
      "Active Pricelists fetched successfully"
    )
  );
})

const updatePricelist=AsyncHandler(async(req,res)=>{
    const {id}=req.params;
    const pricelist=await PriceList.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    });
    if(!pricelist){
        throw new ApiError(404,"Pricelist Not Found");
    }
    return res.status(200).json(
        new ApiResponse(200,pricelist,"PriceList updated SuccesFully")
    )
})

const deletePricelist = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const pricelist = await PriceList.findByIdAndDelete(id);

    if (!pricelist) {
        throw new ApiError(404, "Pricelist Not Found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                success: true,
            },
            "Pricelist Deleted Successfully"
        )
    );
});

export { createPricelist,getAllPricelists,getActivePricelists,updatePricelist,deletePricelist};
