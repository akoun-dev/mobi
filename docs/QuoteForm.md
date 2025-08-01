# Documentation du composant QuoteForm

## Description
Composant React pour un formulaire multi-étapes de devis d'assurance automobile.

## Props

| Nom | Type | Description | Requis |
|------|------|-------------|--------|
| initialStep | number | Étape initiale (0-2) | Oui |
| formData | QuoteFormData | Données initiales du formulaire | Oui |
| onInputChange | function | Callback pour les changements de champ | Oui |
| onOptionToggle | function | Callback pour les options toggle | Oui | 
| onNextStep | function | Callback pour étape suivante | Oui |
| onPrevStep | function | Callback pour étape précédente | Oui |
| onResetForm | function | Callback pour réinitialisation | Oui |
| onSubmit | function | Callback pour soumission | Oui |

## États

| Nom | Type | Description |
|------|------|-------------|
| currentStep | number | Étape actuelle |
| formData | QuoteFormData | Données du formulaire |
| errors | Object | Erreurs de validation |

## Fonctions

- `handleInputChange`: Gère les changements de champs
- `validateCurrentStep`: Valide les champs de l'étape actuelle  
- `handleNextClick`: Gère le passage à l'étape suivante
- `handleResetForm`: Réinitialise le formulaire

## Exemple d'utilisation

```tsx
<QuoteForm
  initialStep={0}
  formData={initialData}
  onInputChange={(field, value) => updateField(field, value)}
  onNextStep={() => advanceStep()}
  onPrevStep={() => goBackStep()}
  onResetForm={() => resetForm()}
  onSubmit={(values) => submitQuote(values)}
/>
```

## Notes
- Le composant est optimisé avec React.memo
- Utilise le localStorage pour sauvegarder la progression
- Intègre le tracking analytics