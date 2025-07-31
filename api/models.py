class Insurer:
    def __init__(self, id, name, logo, rating):
        self.id = id
        self.name = name
        self.logo = logo
        self.rating = rating

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "logo": self.logo,
            "rating": self.rating
        }

class Quote:
    def __init__(self, id, insurer, logo, price, coverage, deductible, options, rating, details):
        self.id = id
        self.insurer = insurer
        self.logo = logo
        self.price = price
        self.coverage = coverage
        self.deductible = deductible
        self.options = options
        self.rating = rating
        self.details = details

    def to_dict(self):
        return {
            "id": self.id,
            "insurer": self.insurer,
            "logo": self.logo,
            "price": self.price,
            "coverage": self.coverage,
            "deductible": self.deductible,
            "options": self.options,
            "rating": self.rating,
            "details": self.details
        }