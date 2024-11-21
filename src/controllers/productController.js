const db = require('../config/db');

// Helper function to build the query based on filters
const buildQuery = (baseQuery, filters) => {
    let query = baseQuery;
    let params = [];

    if (filters.campaign_name) {
        query += ' AND campaign_name = ?';
        params.push(filters.campaign_name);
    }
    if (filters.ad_group_id) {
        query += ' AND ad_group_id = ?';
        params.push(filters.ad_group_id);
    }
    if (filters.fsn_id) {
        query += ' AND fsn_id = ?';
        params.push(filters.fsn_id);
    }
    if (filters.product_name) {
        query += ' AND product_name = ?';
        params.push(filters.product_name);
    }

    // Add pagination parameters
    query += ' LIMIT ? OFFSET ?';
    params.push(filters.limit, (filters.page - 1) * filters.limit);

    return { query, params };
};

// Common function to get product statistics
const getProductStatistics = (filterKey, filterValue, filters) => {
    return new Promise((resolve, reject) => {
        let baseQuery = `
            SELECT 
                campaign_name,
                ad_group_id,
                fsn_id,
                product_name,
                SUM(ad_spend) AS ad_spend,
                SUM(views) AS views,
                SUM(clicks) AS clicks,
                SUM(direct_revenue + indirect_revenue) AS total_revenue,
                SUM(direct_units + indirect_units) AS total_orders
            FROM products
            WHERE ${filterKey} = ?
        `;
        filters[filterKey] = filterValue;

        const { query, params } = buildQuery(baseQuery, filters);

        db.all(query, [filterValue, ...params], (err, rows) => {
            if (err) {
                return reject(err);
            }

            const result = rows.map(row => {
                const ctr = (row.clicks / row.views) * 100 || 0;
                const roas = (row.total_revenue / row.ad_spend) || 0;

                return {
                    campaign_name: row.campaign_name,
                    ad_group_id: row.ad_group_id,
                    fsn_id: row.fsn_id,
                    product_name: row.product_name,
                    ad_spend: row.ad_spend,
                    views: row.views,
                    clicks: row.clicks,
                    ctr: ctr.toFixed(2),
                    total_revenue: row.total_revenue,
                    total_orders: row.total_orders,
                    roas: roas.toFixed(2)
                };
            });

            resolve(result);
        });
    });
};

// API Handlers
const getReportByCampaign = async (req, res) => {
    try {
        const { campaign_name, ad_group_id, fsn_id, product_name, page = 1, limit = 10 } = req.body;
        const filters = { ad_group_id, fsn_id, product_name, page, limit };
        const statistics = await getProductStatistics('campaign_name', campaign_name, filters);
        res.status(200).json({ campaign: campaign_name, statistics });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getReportByAdGroupID = async (req, res) => {
    try {
        const { ad_group_id, campaign_name, fsn_id, product_name, page = 1, limit = 10 } = req.body;
        const filters = { campaign_name, fsn_id, product_name, page, limit };
        const statistics = await getProductStatistics('ad_group_id', ad_group_id, filters);
        res.status(200).json({ adGroupID: ad_group_id, statistics });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getReportByFsnID = async (req, res) => {
    try {
        const { fsn_id, campaign_name, ad_group_id, product_name, page = 1, limit = 10 } = req.body;
        const filters = { campaign_name, ad_group_id, product_name, page, limit };
        const statistics = await getProductStatistics('fsn_id', fsn_id, filters);
        res.status(200).json({ fsnID: fsn_id, statistics });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getReportByProductName = async (req, res) => {
    try {
        const { product_name, campaign_name, ad_group_id, fsn_id, page = 1, limit = 10 } = req.body;
        const filters = { campaign_name, ad_group_id, fsn_id, page, limit };
        const statistics = await getProductStatistics('product_name', product_name, filters);
        res.status(200).json({ productName: product_name, statistics });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getReportByCampaign,
    getReportByAdGroupID,
    getReportByFsnID,
    getReportByProductName
}