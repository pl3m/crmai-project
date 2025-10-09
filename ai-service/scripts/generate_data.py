"""
Generate synthetic training data for lead scoring model.
Creates 10,000 synthetic leads with features and target variable.
"""

import pandas as pd
import numpy as np
from pathlib import Path

# Set random seed for reproducibility
np.random.seed(42)

# Number of samples to generate
N_SAMPLES = 10000

print(f"Generating {N_SAMPLES} synthetic lead records...")

# Generate more realistic features
# Company sizes: Most companies are small, few are large (log-normal distribution)
company_sizes = np.random.lognormal(3, 1.5, N_SAMPLES)
company_sizes = np.clip(company_sizes, 1, 50000).astype(int)

# Engagement scores: Skewed toward lower values (most leads have low engagement)
engagement_scores = np.random.beta(2, 5, N_SAMPLES)

# Industry distribution (realistic weights)
industries = np.random.choice(
    ['technology', 'finance', 'healthcare', 'retail', 'manufacturing'],
    size=N_SAMPLES,
    p=[0.25, 0.20, 0.20, 0.20, 0.15]  # Tech has higher weight
)

# Map industries to numeric scores
industry_score_map = {
    'technology': 0.8,
    'finance': 0.7,
    'healthcare': 0.6,
    'manufacturing': 0.5,
    'retail': 0.4,
}

industry_scores = np.array([industry_score_map[ind] for ind in industries])

# Normalize company size (log scale works better for wide ranges)
company_size_normalized = np.log10(company_sizes) / np.log10(10000)

# Generate target variable with more realistic business logic
conversion_probability = (
    0.5 * engagement_scores +  # Engagement is most important
    0.3 * industry_scores +    # Industry matters
    0.2 * company_size_normalized  # Company size matters less
)

# Add realistic business rules
for i in range(N_SAMPLES):
    # Small retail companies convert less
    if company_sizes[i] < 20 and industries[i] == 'retail':
        conversion_probability[i] *= 0.6
    
    # High engagement tech companies convert more
    if engagement_scores[i] > 0.7 and industries[i] == 'technology':
        conversion_probability[i] *= 1.3
    
    # Very large companies (enterprise) have different conversion patterns
    if company_sizes[i] > 5000:
        conversion_probability[i] *= 0.8  # Longer sales cycles
    
    # Very small companies (1-5 employees) have low conversion
    if company_sizes[i] <= 5:
        conversion_probability[i] *= 0.4

# Add realistic noise
conversion_probability += np.random.normal(0, 0.05, N_SAMPLES)
conversion_probability = np.clip(conversion_probability, 0.1, 0.9)  # Wider range

# Convert to binary outcome with more realistic conversion rates
# Use the probability directly as the target for regression
converted = conversion_probability  # Keep as continuous values for regression

# Create DataFrame
df = pd.DataFrame({
    'company_size': company_sizes,
    'industry': industries,
    'engagement_score': engagement_scores,
    'industry_score': industry_scores,
    'converted': converted
})

# Print statistics
print("\nDataset Statistics:")
print(f"Total records: {len(df)}")
print(f"\nConversion rate: {df['converted'].mean():.2%}")
print(f"\nIndustry distribution:")
print(df['industry'].value_counts())
print(f"\nCompany size statistics:")
print(df['company_size'].describe())
print(f"\nEngagement score statistics:")
print(df['engagement_score'].describe())

# Show conversion probability distribution
print(f"\nConversion probability distribution:")
print(f"Min: {conversion_probability.min():.3f}")
print(f"Max: {conversion_probability.max():.3f}")
print(f"Mean: {conversion_probability.mean():.3f}")
print(f"Std: {conversion_probability.std():.3f}")

# Show score ranges
low_scores = (conversion_probability < 0.3).sum()
medium_scores = ((conversion_probability >= 0.3) & (conversion_probability < 0.7)).sum()
high_scores = (conversion_probability >= 0.7).sum()

print(f"\nScore distribution:")
print(f"Low (0-30%): {low_scores} ({low_scores/len(df)*100:.1f}%)")
print(f"Medium (30-70%): {medium_scores} ({medium_scores/len(df)*100:.1f}%)")
print(f"High (70-100%): {high_scores} ({high_scores/len(df)*100:.1f}%)")

# Create data directory if it doesn't exist
data_dir = Path(__file__).parent.parent / 'data'
data_dir.mkdir(exist_ok=True)

# Save to CSV
output_file = data_dir / 'training_data.csv'
df.to_csv(output_file, index=False)

print(f"\n✅ Training data saved to: {output_file}")
print(f"Shape: {df.shape}")

