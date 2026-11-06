package com.ugurgiyim.controller.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ugurgiyim.controller.IProductController;
import com.ugurgiyim.dto.DtoProduct;
import com.ugurgiyim.dto.DtoProductIU;
import com.ugurgiyim.service.IProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")

public class ProductControllerImpl implements IProductController {
	
	@Autowired
	private IProductService productService;
    
	@PostMapping(path = "/save")
	@Override
	public DtoProduct saveProduct(@Valid  @RequestBody DtoProductIU dtoProductIU) {
		return productService.saveProduct(dtoProductIU);
	}
	@GetMapping(path= "/list")
	@Override
	public List<DtoProduct> getAllProducts(){
		return productService.getAllProducts();
	}
	@GetMapping(path = "/list/{id}")
    @Override
    public DtoProduct getProductById(@PathVariable(name = "id") Integer id) {
        return productService.getProductById(id);
    }
	@DeleteMapping(path="/delete/{id}")
	@Override
	public void deleteProduct(@PathVariable(name="id") Integer id) {
		productService.deleteProduct(id);
		
	}
	@PutMapping(path = "/update/{id}")
    @Override
    public DtoProduct updateProduct(@PathVariable(name = "id") Integer id,@Valid @RequestBody DtoProductIU dtoProductIU) {
        return productService.updateProduct(id, dtoProductIU);
    }
	
	@PutMapping(path="add-stock/{id}")
	@Override
	public DtoProduct addStock(@PathVariable(name="id") Integer id, @RequestParam Integer quantity) {
		return productService.addStock(id, quantity);
	}
	@PutMapping(path = "/toggle-status/{id}")
	@Override
	public DtoProduct toggleProductStatus(@PathVariable(name = "id") Integer id) {
		return productService.toggleProductStatus(id);
	}
	
	

 
}
