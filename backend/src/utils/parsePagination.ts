export function parsePagination(query: any) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
        throw new Error("Invalid pagination parameters");
    }

    return {
        skip: (page - 1) * limit,
        take: limit,
    };
}
