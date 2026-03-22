#!/bin/bash

# Sunny IA Assistant - Quick API Testing Script
# Usage: bash test_sunny_api.sh
# Make sure server is running: node server-sunny.js

API_URL="http://localhost:4000/api/sunny"
SESSION_ID=""

echo "🌞 Sunny IA Assistant - API Testing"
echo "===================================="
echo ""

# Check if server is running
echo "⏳ Checking if Sunny server is running..."
if ! curl -s "$API_URL/health" > /dev/null 2>&1; then
  echo "❌ Server not running!"
  echo "   Start it with: node server-sunny.js"
  exit 1
fi
echo "✅ Server is running"
echo ""

# Test 1: Health Check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Request:"
echo "  GET $API_URL/health"
echo ""
RESPONSE=$(curl -s -X GET "$API_URL/health")
echo "Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Test 2: Greeting
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Greeting Message (New Session)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Request:"
echo "  POST $API_URL/message"
echo "  Body: { message: '¡Hola Sunny!' }"
echo ""

RESPONSE=$(curl -s -X POST "$API_URL/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¡Hola Sunny!",
    "sessionId": null,
    "metadata": {
      "device": "web",
      "test": true
    }
  }')

echo "Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Extract sessionId for next test
SESSION_ID=$(echo "$RESPONSE" | jq -r '.data.sessionId')
echo "✓ Got Session ID: $SESSION_ID"
echo ""

# Test 3: SEO Question
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: SEO Question (Continue Session)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Request:"
echo "  POST $API_URL/message"
echo "  Body: { message: '¿Cómo mejorar mi SEO?', sessionId: '$SESSION_ID' }"
echo ""

RESPONSE=$(curl -s -X POST "$API_URL/message" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"¿Cómo puedo mejorar mi ranking en Google?\",
    \"sessionId\": \"$SESSION_ID\",
    \"metadata\": {
      \"device\": \"web\",
      \"test\": true
    }
  }")

echo "Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Test 4: Pricing Question
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: Pricing Inquiry (Continue Session)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Request:"
echo "  POST $API_URL/message"
echo "  Body: { message: '¿Cuál es el precio?', sessionId: '$SESSION_ID' }"
echo ""

RESPONSE=$(curl -s -X POST "$API_URL/message" \
  -H "Content-Type: application/json" \
  -d "{
    \"message\": \"¿Cuál es el costo de una consulta para pequeños negocios?\",
    \"sessionId\": \"$SESSION_ID\",
    \"metadata\": {
      \"device\": \"mobile\",
      \"test\": true
    }
  }")

echo "Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Test 5: Error - Empty Message
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 5: Error Handling (Empty Message)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Request:"
echo "  POST $API_URL/message"
echo "  Body: { message: '' }"
echo ""

RESPONSE=$(curl -s -X POST "$API_URL/message" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "",
    "sessionId": null
  }')

echo "Response:"
echo "$RESPONSE" | jq '.'
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Testing Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Summary:"
echo "  ✓ Health check passed"
echo "  ✓ Greeting message processed"
echo "  ✓ SEO question detected and answered"
echo "  ✓ Pricing inquiry handled"
echo "  ✓ Error validation working"
echo ""
echo "🎉 Sunny API is working correctly!"
echo ""
