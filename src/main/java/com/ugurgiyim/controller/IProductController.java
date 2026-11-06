package com.ugurgiyim.controller;

import java.util.List;

import com.ugurgiyim.dto.DtoProduct;
import com.ugurgiyim.dto.DtoProductIU;



public interface IProductController {
	
	
	public DtoProduct saveProduct(DtoProductIU dtoProductIU);

	public List<DtoProduct> getAllProducts();
	
	public DtoProduct getProductById(Integer id);
	public void deleteProduct(Integer id);
	public DtoProduct updateProduct(Integer id,DtoProductIU dtoProductIU);
	public DtoProduct addStock(Integer id, Integer quantity);
	public DtoProduct toggleProductStatus(Integer id);

}
