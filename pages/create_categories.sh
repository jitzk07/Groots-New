#!/bin/bash
# Create category pages
categories=(
  "footwear:Footwear:Discover premium footwear for every occasion"
  "jewelry:Jewelry:Explore our exquisite jewelry collection"
  "perfume:Perfume:Find your signature scent from our curated collection"
  "cosmetics:Cosmetics:Shop premium cosmetics and beauty products"
  "glasses:Glasses:Browse stylish eyewear including sunglasses"
  "bags:Bags:Discover our collection of bags and accessories"
  "shopping-bag:Shopping Bags:Shop for shopping bags and tote bags"
  "gym-backpack:Gym Backpacks:Find the perfect gym backpack"
  "purse:Purses:Browse elegant purses and handbags"
  "wallet:Wallets:Shop for wallets and card holders"
)

for cat in "${categories[@]}"; do
  IFS=':' read -r filename title desc <<< "$cat"
  echo "Creating $filename.html"
done
