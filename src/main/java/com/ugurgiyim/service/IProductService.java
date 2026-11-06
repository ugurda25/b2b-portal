package com.ugurgiyim.service;

import com.ugurgiyim.dto.DtoProduct;
import com.ugurgiyim.dto.DtoProductIU;

import java.util.List;

public interface IProductService {

    public DtoProduct saveProduct(DtoProductIU dtoProductIU);
    public List<DtoProduct> getAllProducts();
    public DtoProduct getProductById(int id);
    public void deleteProduct(Integer id);
    public DtoProduct updateProduct(Integer id,DtoProductIU dtoProductIU);
    public DtoProduct addStock(Integer id, Integer quantity);
    public DtoProduct toggleProductStatus(Integer id);
    
}