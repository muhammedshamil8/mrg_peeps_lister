const airtableApiUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY;

export const fetchRecords = async (tableName, filterParams, sortField, sortDirection, maxRecords) => {
    try {
        const url = new URL(`${airtableApiUrl}/${tableName}`);

        if (filterParams){
            url.searchParams.append('filterByFormula', filterParams);
        }
        if (sortField && sortDirection){
            url.searchParams.append('sort[0][field]', sortField);
            url.searchParams.append('sort[0][direction]', sortDirection);
        }
        if (maxRecords){
            url.searchParams.append('maxRecords', maxRecords);
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching records: ${response.statusText}`);
        }

        const data = await response.json();
        return data.records;

    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};

export const fetchRecord = async (tableName, recordId) => {
    try {
        const url = `${airtableApiUrl}/${tableName}/${recordId}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching record: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching record:", error);
        throw error;
    }
}

export const createRecord = async (tableName, fields) => {
    try {
        const url = `${airtableApiUrl}/${tableName}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields }),
        });

        if (!response.ok) {
            throw new Error(`Error creating record: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error creating record:", error);
        throw error;
    }
}


export const updateRecord = async (tableName, recordId, fields) => {
    try {
        const url = `${airtableApiUrl}/${tableName}/${recordId}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fields }),
        });

        if (!response.ok) {
            throw new Error(`Error updating record: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
}


export const deleteRecord = async (tableName, recordId) => {
    try {
        const url = `${airtableApiUrl}/${tableName}/${recordId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error deleting record: ${response.statusText}`);
        }

        return true;

    } catch (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
}
