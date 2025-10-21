import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { qrSignature } = await request.json()

    if (!qrSignature) {
      return NextResponse.json(
        { success: false, message: 'QR signature is required' },
        { status: 400 }
      )
    }

    // Call your backend verification endpoint
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-qr`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrSignature }),
      }
    )

    const result = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: result.message || 'Verification failed' },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('QR verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
