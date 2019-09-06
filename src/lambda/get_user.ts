export async function handler(event: any) {
    const id = event.pathParameters.id;

    // 取得したことにする
    return {
        statusCode: 200,
        body: JSON.stringify({
            env: process.env.SYSTEM_ENV,
            message: `get user id: ${id}`
        }),
    }
}
