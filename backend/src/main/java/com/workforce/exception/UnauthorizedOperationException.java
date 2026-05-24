package com.workforce.exception;

public class UnauthorizedOperationException extends RuntimeException {
		public UnauthorizedOperationException(String msg) {
			super(msg);
		}
}
