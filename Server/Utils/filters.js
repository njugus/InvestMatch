import { connectDB } from '../Utils/Connection.js'
const filterStartups = async (query) => {
    const { industry, fundingStage, location, sortBy, order, page, limit } = query;

    // Create filter object
    const filters = {};
    if (industry) filters.Industry = industry;
    if (fundingStage) filters.FundingStage = fundingStage;
    if (location) filters.GeographicLocation = location;

    // Sorting options
    const sortingOptions = {};
    if (sortBy) {
        sortingOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
        sortingOptions["CreatedAt"] = -1; // Default sorting (newest first)
    }

    // Pagination setup
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNum - 1) * pageSize;

    // Connect to database
    const db = await connectDB();
    const collection = db.collection("Startup");

    // Fetch startups
    const startups = await collection
        .find(filters)
        .sort(sortingOptions)
        .skip(skip)
        .limit(pageSize)
        .toArray();

    // Count total filtered results
    const totalCount = await collection.countDocuments(filters);

    return { startups, totalCount, pageNum, pageSize };
};

export default filterStartups;