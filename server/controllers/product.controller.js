import ProductModel from "../models/product.model.js";
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;
    console.log(req.body);

    if (
      !name ||
      !category ||
      !Array.isArray(category) ||
      category.length === 0 ||
      !subCategory ||
      !Array.isArray(subCategory) ||
      subCategory.length === 0 ||
      price === undefined ||
      price === null ||
      !unit
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, category, subCategory, price, and unit.",
      });
    }

    const payload = {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    };

    const product = new ProductModel(payload);
    await product.save();
    return res.status(201).json({
      message: "Product Created",
      data: product,
      error: false,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProductController = async (request, response) => {
  try {
    let { page, limit, search } = request.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const query = search ? { $text: { $search: search } } : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async(request,response)=>{
  try {
      const { id } = request.body 

      if(!id){
          return response.status(400).json({
              message : "provide category id",
              error : true,
              success : false
          })
      }

      const product = await ProductModel.find({ 
          category : { $in : id }
      }).limit(15)

      return response.json({
          message : "category product list",
          data : product,
          error : false,
          success : true
      })
  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}


export const getProductByCategoryAndSubCategory  = async(request,response)=>{
  try {
      const { categoryId,subCategoryId,page,limit } = request.body

      if(!categoryId || !subCategoryId){
          return response.status(400).json({
              message : "Provide categoryId and subCategoryId",
              error : true,
              success : false
          })
      }

      if(!page){
          page = 1
      }

      if(!limit){
          limit = 10
      }

      const query = {
          category : { $in :categoryId  },
          subCategory : { $in : subCategoryId }
      }

      const skip = (page - 1) * limit

      const [data,dataCount] = await Promise.all([
          ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
          ProductModel.countDocuments(query)
      ])

      return response.json({
          message : "Product list",
          data : data,
          totalCount : dataCount,
          page : page,
          limit : limit,
          success : true,
          error : false
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

export const getProductDetails = async(request,response)=>{
  try {
      const { productId } = request.body 

      const product = await ProductModel.findOne({ _id : productId })


      return response.json({
          message : "product details",
          data : product,
          error : false,
          success : true
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

//update product
export const updateProductDetails = async(request,response)=>{
  try {
      const { _id } = request.body 

      if(!_id){
          return response.status(400).json({
              message : "provide product _id",
              error : true,
              success : false
          })
      }

      const updateProduct = await ProductModel.updateOne({ _id : _id },{
          ...request.body
      })

      return response.json({
          message : "updated successfully",
          data : updateProduct,
          error : false,
          success : true
      })

  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

//delete product
export const deleteProductDetails = async(request,response)=>{
  try {
      const { _id } = request.body 

      if(!_id){
          return response.status(400).json({
              message : "provide _id ",
              error : true,
              success : false
          })
      }

      const deleteProduct = await ProductModel.deleteOne({_id : _id })

      return response.json({
          message : "Delete successfully",
          error : false,
          success : true,
          data : deleteProduct
      })
  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}

//search product
export const searchProduct = async(request,response)=>{
  try {
      let { search, page , limit } = request.body 

      if(!page){
          page = 1
      }
      if(!limit){
          limit  = 10
      }

      const query = search ? {
          $text : {
              $search : search
          }
      } : {}

      const skip = ( page - 1) * limit

      const [data,dataCount] = await Promise.all([
          ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category subCategory'),
          ProductModel.countDocuments(query)
      ])

      return response.json({
          message : "Product data",
          error : false,
          success : true,
          data : data,
          totalCount :dataCount,
          totalPage : Math.ceil(dataCount/limit),
          page : page,
          limit : limit 
      })


  } catch (error) {
      return response.status(500).json({
          message : error.message || error,
          error : true,
          success : false
      })
  }
}