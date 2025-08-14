export const formatRfqId = (id: string) => {
    if (!id) return "N/A"
    return id.slice(0, 8).toUpperCase()
}