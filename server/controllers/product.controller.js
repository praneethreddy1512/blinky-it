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
