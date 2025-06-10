/**
 * @file logger.service.ts
 * @description
 * This file provides the `LoggerService` class, a utility for consistent
 * console logging across the benchmarking suite. It offers methods for
 * logging general messages, informational messages, warnings, errors,
 * and formatted headers to improve readability of benchmark output.
 */

/**
 * A service for logging messages to the console with different levels of severity
 * and formatting.
 */
export class LoggerService {
    /**
     * Logs a general message to the console.
     * @param message - The message string to log.
     */
    public log(message: string): void {
        console.log(message);
    }

    /**
     * Logs an informational message to the console.
     * @param message - The informational message string to log.
     */
    public info(message: string): void {
        console.info(message);
    }

    /**
     * Logs a warning message to the console.
     * @param message - The warning message string to log.
     */
    public warn(message: string): void {
        console.warn(message);
    }
    
    /**
     * Logs an error message to the console, optionally including an error object.
     * @param message - The error message string to log.
     * @param error - (Optional) The error object to log alongside the message.
     */
    public error(message: string, error?: unknown): void {
        console.error(message, error || '');
    }

    /**
     * Logs a formatted header to the console, typically used to demarcate sections
     * in the benchmark output.
     * @param title - The title for the header.
     */
    public header(title: string): void {
        this.log(`\n================================================`);
        this.log(title.toUpperCase());
        this.log(`================================================`);
    }
}