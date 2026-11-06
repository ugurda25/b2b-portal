package com.ugurgiyim.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ugurgiyim.dto.DtoProduct;
import com.ugurgiyim.dto.DtoProductIU;
import com.ugurgiyim.entity.Product;
import com.ugurgiyim.repository.ProductRepository;
import com.ugurgiyim.service.IProductService;
@Service
public class ProductServiceImpl implements IProductService {
	
	@Autowired
	private ProductRepository productRepository;
	
	@Override
	public DtoProduct saveProduct(DtoProductIU dtoProductIU) {
		Product product=new Product();
		BeanUtils.copyProperties(dtoProductIU, product);
		Product dbProduct =  productRepository.save(product);
		DtoProduct response=new DtoProduct();
		BeanUtils.copyProperties(dbProduct, response);
		return response;
		
	}

	@Override
	public List<DtoProduct> getAllProducts() {
		List<DtoProduct> dtoList = new ArrayList<>();
		List<Product> productList =productRepository.findAll();
		for (Product product : productList) {
			DtoProduct dto= new DtoProduct();
			BeanUtils.copyProperties(product,dto);
			dtoList.add(dto);
		}
		return dtoList;
	}

	@Override
	public DtoProduct getProductById(int id) {
		
	Product dbProduct= productRepository.findById(id).orElseThrow(() -> new RuntimeException("Hata." + id + "Numaralı aranan ürün bulunamadı!"));
	DtoProduct optionalDtoProduct= new DtoProduct();
	BeanUtils.copyProperties(dbProduct, optionalDtoProduct);
	return optionalDtoProduct;
	
	}

	@Override
	public void deleteProduct(Integer id) {
    Product dbProduct = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Hata: " + id + " Numaralı ürün bulunamadı!"));
    dbProduct.setIsActive(false);
    productRepository.save(dbProduct);
	}

	@Override
	public DtoProduct updateProduct(Integer id, DtoProductIU dtoProductIU) {
	    DtoProduct response = new DtoProduct();

	    Optional<Product> optional = productRepository.findById(id);
	    if (optional.isPresent()) {
	        Product dbProduct = optional.get();

	        dbProduct.setBarcode(dtoProductIU.getBarcode());
	        dbProduct.setName(dtoProductIU.getName());
	        dbProduct.setAvailableStock(dtoProductIU.getAvailableStock());
	        dbProduct.setCostPrice(dtoProductIU.getCostPrice());
	        dbProduct.setWholeSalePrice(dtoProductIU.getWholeSalePrice());
	        dbProduct.setCurrency(dtoProductIU.getCurrency());
	        dbProduct.setMinOrderQuantity(dtoProductIU.getMinOrderQuantity());
	        dbProduct.setIsActive(dtoProductIU.getIsActive());
	     // Kısmi güncelleme (Partial Update) kalkanıyla birlikte ekliyoruz:
	        if (dtoProductIU.getImageBase64() != null && !dtoProductIU.getImageBase64().isEmpty()) {
	            dbProduct.setImageBase64(dtoProductIU.getImageBase64());
	        }

	        Product updatedProduct = productRepository.save(dbProduct);

	        BeanUtils.copyProperties(updatedProduct, response);
	        return response;
	    }

	    return null;
	}
	@Override
	public DtoProduct addStock(Integer id, Integer quantity) {
		if (quantity == null || quantity <= 0) {
			throw new RuntimeException("Eklenecek stok miktarı 0'dan büyük olmalıdır!");
		}

		Product product = productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Hata: " + id + " numaralı ürün bulunamadı!"));

		int currentStock = product.getAvailableStock() != null ? product.getAvailableStock() : 0;
		product.setAvailableStock(currentStock + quantity);

		Product saved = productRepository.save(product);

		DtoProduct response = new DtoProduct();
		BeanUtils.copyProperties(saved, response);
		return response;
	}

	@Override
	public DtoProduct toggleProductStatus(Integer id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Hata: " + id + " numaralı ürün bulunamadı!"));

		boolean currentStatus = product.getIsActive() != null ? product.getIsActive() : true;
		product.setIsActive(!currentStatus); // Aktifse pasif, pasifse aktif yap

		Product saved = productRepository.save(product);

		DtoProduct response = new DtoProduct();
		BeanUtils.copyProperties(saved, response);
		return response;
	}
	
}
