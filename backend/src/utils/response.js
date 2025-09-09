class ApiResponse {
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    static error(res, message = 'Error', code = 'ERROR', statusCode = 500, details = null) {
        return res.status(statusCode).json({
            success: false,
            error: {
                message,
                code,
                details,
                timestamp: new Date().toISOString()
            }
        });
    }

    static created(res, data = null, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    static noContent(res) {
        return res.status(204).send();
    }

    static badRequest(res, message = 'Bad request', code = 'BAD_REQUEST', details = null) {
        return this.error(res, message, code, 400, details);
    }

    static unauthorized(res, message = 'Unauthorized', code = 'UNAUTHORIZED') {
        return this.error(res, message, code, 401);
    }

    static forbidden(res, message = 'Forbidden', code = 'FORBIDDEN') {
        return this.error(res, message, code, 403);
    }

    static notFound(res, message = 'Resource not found', code = 'NOT_FOUND') {
        return this.error(res, message, code, 404);
    }

    static conflict(res, message = 'Conflict', code = 'CONFLICT', details = null) {
        return this.error(res, message, code, 409, details);
    }

    static validationError(res, errors, message = 'Validation failed') {
        return this.badRequest(res, message, 'VALIDATION_ERROR', errors);
    }

    static paginated(res, data, page, limit, total, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            },
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ApiResponse;
