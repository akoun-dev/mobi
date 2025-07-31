from flask import jsonify, request, make_response
from models import Insurer, Quote
from weasyprint import HTML
from datetime import datetime

insurers_data = [
    Insurer(1, "NSIA Assurance", "🛡️", 4.5),
    Insurer(2, "Atlantique Assurance", "🌊", 4.2),
    Insurer(3, "Saham Assurance", "⭐", 4.0),
    Insurer(4, "Allianz CI", "🏆", 4.8),
    Insurer(5, "Sunu Assurances", "☀️", 3.8),
    Insurer(6, "AXA CI", "🔷", 4.3),
    Insurer(7, "Colina", "🏛️", 4.1),
    Insurer(8, "Activa", "⚡", 4.0)
]

def get_insurers():
    return jsonify([insurer.to_dict() for insurer in insurers_data])

def generate_quotes():
    data = request.json
    quotes = [
        Quote(
            id=1,
            insurer="NSIA Assurance",
            logo="🛡️",
            price=calculate_price(data, 85000),
            coverage=data.get('coverage', 'Tous risques'),
            deductible=25000,
            options=["Assistance 24h/24", "Véhicule de remplacement"],
            rating=4.5,
            details="Couverture complète avec assistance premium"
        ),
        Quote(
            id=2,
            insurer="Atlantique Assurance",
            logo="🌊",
            price=calculate_price(data, 92000),
            coverage=data.get('coverage', 'Tous risques'),
            deductible=20000,
            options=["Assistance 24h/24", "Bris de glace"],
            rating=4.2,
            details="Protection optimale pour votre véhicule"
        ),
        Quote(
            id=3,
            insurer="Saham Assurance",
            logo="⭐",
            price=calculate_price(data, 78000),
            coverage=data.get('coverage', 'Tiers étendu'),
            deductible=30000,
            options=["Assistance dépannage"],
            rating=4.0,
            details="Solution économique fiable"
        ),
        Quote(
            id=4,
            insurer="Allianz CI",
            logo="🏆",
            price=calculate_price(data, 98000),
            coverage=data.get('coverage', 'Tous risques Premium'),
            deductible=15000,
            options=["Assistance 24h/24", "Véhicule haut de gamme"],
            rating=4.8,
            details="Service premium international"
        ),
        Quote(
            id=5,
            insurer="Sunu Assurances",
            logo="☀️",
            price=calculate_price(data, 75000),
            coverage=data.get('coverage', 'Tiers simple'),
            deductible=35000,
            options=["Assistance dépannage"],
            rating=3.8,
            details="Solution économique pour petits budgets"
        ),
        Quote(
            id=6,
            insurer="AXA CI",
            logo="🔷",
            price=calculate_price(data, 95000),
            coverage=data.get('coverage', 'Tous risques'),
            deductible=20000,
            options=["Assistance 24h/24", "Protection juridique"],
            rating=4.3,
            details="Assureur international de référence"
        )
    ]
    return jsonify([quote.to_dict() for quote in quotes])

def calculate_price(form_data, base_price):
    price = base_price
    if form_data.get('coverage') == 'Tous risques':
        price *= 1.2
    elif form_data.get('coverage') == 'Tiers étendu':
        price *= 0.8
        
    vehicle_value = form_data.get('vehicleValue', '0')
    if not vehicle_value.isdigit():
        vehicle_value = '0'
    if int(vehicle_value) > 10000000:
        price *= 1.1
        
    return round(price)

def generate_pdf():
    data = request.json
    quote = next((q for q in generate_quotes().json if q['id'] == data['quote_id']), None)
    
    if not quote:
        return jsonify({'error': 'Devis non trouvé'}), 404

    html_template = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Devis Assurance - {quote['insurer']}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 2cm; }}
            h1 {{ color: #2c3e50; }}
            .header {{ display: flex; justify-content: space-between; }}
            .logo {{ font-size: 24px; }}
            .details {{ margin-top: 30px; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
            .total {{ font-weight: bold; font-size: 18px; }}
            .footer {{ margin-top: 50px; font-size: 12px; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1>Devis Assurance Automobile</h1>
                <p>Date: {datetime.now().strftime('%d/%m/%Y')}</p>
            </div>
            <div class="logo">{quote['logo']} {quote['insurer']}</div>
        </div>

        <div class="details">
            <h2>Détails du contrat</h2>
            <table>
                <tr>
                    <th>Garantie</th>
                    <td>{quote['coverage']}</td>
                </tr>
                <tr>
                    <th>Franchise</th>
                    <td>{quote['deductible']} FCFA</td>
                </tr>
                <tr>
                    <th>Options</th>
                    <td>{', '.join(quote['options'])}</td>
                </tr>
            </table>
        </div>

        <div class="total">
            <p>Montant total: {quote['price']} FCFA</p>
        </div>

        <div class="footer">
            <p>{quote['insurer']} - {quote['details']}</p>
            <p>Note: {quote['rating']}/5</p>
        </div>
    </body>
    </html>
    """

    try:
        pdf = HTML(string=html_template).write_pdf(optimize_size=('images', 'fonts'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=devis_{quote["insurer"]}.pdf'
    return response