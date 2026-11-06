package com.ugurgiyim.exception;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>> handleValidationException(MethodArgumentNotValidException ex) {
        
        // Hatalı olan tüm alanların mesajlarını toplayacağımız liste
        List<String> errorMessages = new ArrayList<>();

        // Spring'in yakaladığı tüm hataları döngüyle listeye ekliyoruz
        for (ObjectError error : ex.getBindingResult().getAllErrors()) {
            errorMessages.add(error.getDefaultMessage());
        }

        // Hata mesajları listesini ve 400 Bad Request kodunu dönüyoruz
        return new ResponseEntity<>(errorMessages, HttpStatus.BAD_REQUEST);
        
    }
        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<List<String>> handleRuntimeException(RuntimeException ex) {
            
            List<String> errorMessages = new ArrayList<>();
            errorMessages.add(ex.getMessage()); // Fırlattığımız Türkçe hata mesajını ekliyoruz

            return new ResponseEntity<>(errorMessages, HttpStatus.BAD_REQUEST);
        
    }
}