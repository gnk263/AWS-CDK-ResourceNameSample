export async function handler(event: any) {
    const id = event.pathParameters.id;

    // 作ったことにする
    return {
        statusCode: 200,
        body: JSON.stringify({
            env: process.env.SYSTEM_ENV,
            message: `create user id: ${id}`
        }),
    }
}
