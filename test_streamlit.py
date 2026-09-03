"""
Streamlit App Verification & Diagnostics Script
Tests all core functions of streamlit_app.py directly.
"""

import sys
import io

# Force UTF-8 for console output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def test_app():
    print("Testing Streamlit App Core Meteorological & AI Logic...")
    
    import requests
    import pandas as pd
    import plotly.express as px
    import plotly.graph_objects as go
    
    # 1. Test Geocoding
    from streamlit_app import geocode_city, fetch_weather_data, evaluate_imd_alerts, process_chat_query
    
    print("\n1. Testing Geocoding for Chennai and New Delhi...")
    chennai_geo = geocode_city("Chennai")
    print(f"   -> Chennai Geocoded: lat={chennai_geo['lat']}, lon={chennai_geo['lon']}, state={chennai_geo['state']}")
    assert chennai_geo['lat'] == 13.0827, "Geocoding failed for Chennai"
    
    # 2. Test Live Weather Data Fetching from Open-Meteo
    print("\n2. Testing Live Open-Meteo Meteorological Fetch...")
    weather = fetch_weather_data(chennai_geo['lat'], chennai_geo['lon'], chennai_geo['name'])
    assert weather is not None, "Weather data fetch failed"
    assert 'current' in weather, "Missing current weather object"
    assert 'daily' in weather, "Missing daily forecast object"
    print(f"   -> Current Temp: {weather['current']['temperature_2m']}°C, Humidity: {weather['current']['relative_humidity_2m']}%")
    
    # 3. Test IMD Hazard Alert Detection
    print("\n3. Testing IMD Hazard Alert Engine...")
    alerts = evaluate_imd_alerts("Chennai", 32, 36, 26, 14, 20, 0, 15, 1, 6.0, 65)
    print(f"   -> Detected {len(alerts)} alerts. Top alert: {alerts[0]['badge']} - {alerts[0]['title']}")
    assert len(alerts) > 0, "Alert engine returned empty list"
    
    # 4. Test Conversational AI Natural Language Processor across all 4 Languages
    print("\n4. Testing Conversational AI Natural Language Processor across Languages...")
    
    # English
    en_reply = process_chat_query("Will it rain tomorrow in Chennai?", "Chennai", weather, 'en')
    print(f"   -> English Query Reply: {en_reply[:80]}...")
    assert "Chennai" in en_reply, "English reply missing city name"
    
    # Hindi
    hi_reply = process_chat_query("चेन्नई में मौसम कैसा है?", "Chennai", weather, 'hi')
    print(f"   -> Hindi Query Reply: {hi_reply[:80]}...")
    assert len(hi_reply) > 10, "Hindi reply too short"
    
    # Tamil
    ta_reply = process_chat_query("சென்னையில் மழை பெய்யுமா?", "Chennai", weather, 'ta')
    print(f"   -> Tamil Query Reply: {ta_reply[:80]}...")
    assert len(ta_reply) > 10, "Tamil reply too short"
    
    # Telugu
    te_reply = process_chat_query("చెన్నైలో వర్షం పడుతుందా?", "Chennai", weather, 'te')
    print(f"   -> Telugu Query Reply: {te_reply[:80]}...")
    assert len(te_reply) > 10, "Telugu reply too short"
    
    # Out of domain query
    ood_reply = process_chat_query("Write a python script for binary search", "Chennai", weather, 'en')
    print(f"   -> Out of Domain Guardrail: {ood_reply[:80]}...")
    assert "WeatherGPT" in ood_reply, "Out of domain guardrail failed"
    
    print("\n=============================================================")
    print("🎉 ALL STREAMLIT APP TESTS PASSED WITH 100% SUCCESS!")
    print("=============================================================")

if __name__ == '__main__':
    test_app()
