const fs = require('fs');
const newman = require('newman');

// Define folders and their respective data files
const runs = [
    // { folder: "address", data: "../data/addresses.json" },
    { folder: "insert fail schema validation", data: "../data/techlogCounters/techlogCounters_insertFail_schemaValidation.json" },
    { folder: "insert fail internal validation", data: "../data/techlogCounters/techlogCounters_insertFail_internalValidation.json" },
    { folder: "insert-ETechlogCounter", data: "../data/techlogCounters/eTechlogTLC/techlogCounters.json" },
    { folder: "delete-ETechlogCounter", data: "../data/techlogCounters/eTechlogTLC/techlogCounters.json" },
    { folder: "update etechlog", data: "../data/techlogCounters/eTechlogTLC/techlogCounters_update.json" },
    { folder: "insert classic techlog tlc", data: "../data/techlogCounters/classicTechlogTLC/techlogCounters.json" },
    { folder: "update classic techlog tlc", data: "../data/techlogCounters/classicTechlogTLC/techlogCounters_update.json" },
    { folder: "delete classic techlog tlc", data: "../data/techlogCounters/classicTechlogTLC/techlogCounters.json" },
    // { folder: "auth", data: "../data/users.json" },
];

// Function to run Newman
const runNewman = ({ folder, data }) => {
    return new Promise((resolve, reject) => {
        newman.run({
            collection: '../collections/mrx_api.collection.json', // Path to your collection
            folder: folder,
            iterationData: data, // Path to the data file
            reporters: ['cli'],
            environment: "../data/environment.json",
            exportEnvironment: "../data/environment.json"
        }, (err) => {
            if (err) {
                console.error(`Error running folder "${folder}":`, err);
                return reject(err);
            }
            console.log(`Folder "${folder}" completed.`);
            resolve();
        });
    });
};

function clearEnvironmentFile(envPath) {
    const defaultEnvironment = {
        id: "default",
        name: "Environment",
        values: [],
        _postman_variable_scope: "environment",
        _postman_exported_at: new Date().toISOString(),
        _postman_exported_using: "Postman/10.x.x"
    };

    fs.writeFileSync(envPath, JSON.stringify(defaultEnvironment, null, 2));
    console.log('Environment file cleared.');
}

// Run Newman sequentially
(async () => {
    clearEnvironmentFile("../data/environment.json");
    for (const run of runs) {
        try {
            await runNewman(run); // Wait for the current run to complete
        } catch (err) {
            console.error(`Error processing run for folder: ${run.folder}`);
            break; // Stop the execution if an error occurs
        }
    }
    console.log('All Newman runs completed.');

    // Clear the environment file
    clearEnvironmentFile("../data/environment.json");
})();
