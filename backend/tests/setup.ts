// Test setup file
process.env.NODE_ENV = 'test';

// Mock config
jest.mock('config', () => ({
    get: (key: string) => {
        const config: Record<string, any> = {
            'app.port': 3000,
            'app.name': 'Vacations API (Test)',
            'app.secret': 'test-secret',
            'app.jwtSecret': 'test-jwt-secret',
            'app.jwtExpiration': '24h',
            'db.host': 'localhost',
            'db.port': 3306,
            'db.username': 'test',
            'db.password': 'test',
            'db.database': 'vacations_test',
            's3.endpoint': 'http://localhost:4566',
            's3.bucket': 'vacation-images',
            's3.region': 'us-east-1',
            's3.accessKeyId': 'test',
            's3.secretAccessKey': 'test'
        };
        return config[key];
    }
}));
