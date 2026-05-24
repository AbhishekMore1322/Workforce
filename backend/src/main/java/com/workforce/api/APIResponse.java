package com.workforce.api;
import lombok.*;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class APIResponse <T>{
	
	private String status;
	private String message;
	private T data;
}
