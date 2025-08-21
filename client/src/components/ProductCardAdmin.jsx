import React from "react";

const ProductCardAdmin = ({ data }) => {
  return (
    <div className="w-36 bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
      <div>
        <img
          src={data?.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-dowm"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-medium">{data?.name}</p>
      <p>{data?.unit} Unit</p>
      {/* <p>{data?.price}</p> */}
    </div>
  );
};

export default ProductCardAdmin;
