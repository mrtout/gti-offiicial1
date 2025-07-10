import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id;
    
    // En production, récupérer la transaction et générer un QR code
    // avec une bibliothèque comme 'qrcode'
    
    // Pour la démo, retourner une image QR code fictive
    const qrCodeSvg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="40" y="40" width="120" height="120" fill="white"/>
        <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">
          QR Code
        </text>
        <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="8" fill="black">
          ${transactionId}
        </text>
      </svg>
    `;

    return new NextResponse(qrCodeSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Erreur génération QR code:', error);
    return NextResponse.json(
      { error: 'Erreur génération QR code' },
      { status: 500 }
    );
  }
}