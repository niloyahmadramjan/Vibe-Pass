// hooks/useDeviceInfo.js
import { useState, useEffect } from 'react'

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(null)

  useEffect(() => {
    const getDeviceInfo = async () => {
      const screen_width = screen.width
      const screen_height = screen.height
      const window_width = window.innerWidth
      const window_height = window.innerHeight
      const color_depth = screen.colorDepth
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const platform = navigator.platform
      const user_agent = navigator.userAgent
      const language = navigator.language
      const cookie_enabled = navigator.cookieEnabled
      const touch_support =
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      const device_memory = navigator.deviceMemory || 'Unknown'
      const cpu_cores = navigator.hardwareConcurrency || 'Unknown'
      const referrer = document.referrer || 'None'
      const page_visibility = document.visibilityState
      const do_not_track = navigator.doNotTrack || 'Unknown'
      const online_status = navigator.onLine
      const history_length = window.history.length
      const load_time = performance.now().toFixed(2) + ' ms'
      const orientation =
        screen.orientation?.type || window.orientation || 'Unknown'
      const connection_type = navigator.connection?.effectiveType || 'Unknown'
      const downlink = navigator.connection?.downlink || 'Unknown'
      const rtt = navigator.connection?.rtt || 'Unknown'

      // GPU Info
      let gpu_vendor = 'Unknown'
      let gpu_renderer = 'Unknown'
      try {
        const canvas = document.createElement('canvas')
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          gpu_vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
          gpu_renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        }
      } catch (e) {}

      // Battery Info
      let battery_level = 'Unknown'
      let battery_charging = 'Unknown'
      if (navigator.getBattery) {
        try {
          const battery = await navigator.getBattery()
          battery_level = Math.round(battery.level * 100) + '%'
          battery_charging = battery.charging ? 'Yes' : 'No'
        } catch (err) {}
      }

      // IP + Location Info
      let ip = 'Unknown'
      let locationData = {}
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        ip = data.ip
        locationData = {
          city: data.city,
          region: data.region,
          country: data.country_name,
          postal: data.postal,
          latitude: data.latitude,
          longitude: data.longitude,
          org: data.org,
        }
      } catch (err) {
        console.warn('Failed to fetch IP/location info')
      }

      // Optional: Try getting real GPS location (if allowed)
      let gps_location = 'Permission denied'
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation?.getCurrentPosition(
            (position) => {
              gps_location = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy + ' meters',
              }
              resolve()
            },
            (error) => {
              gps_location = error.message
              resolve()
            },
            { timeout: 5000 }
          )
        })
      } catch (err) {}

      // Media Devices
      let has_camera = false
      let has_microphone = false
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        has_camera = devices.some((d) => d.kind === 'videoinput')
        has_microphone = devices.some((d) => d.kind === 'audioinput')
      } catch (err) {}

      // Final data
      setDeviceInfo({
        screen_width,
        screen_height,
        window_width,
        window_height,
        color_depth,
        timezone,
        platform,
        user_agent,
        language,
        cookie_enabled,
        touch_support,
        device_memory,
        cpu_cores,
        referrer,
        page_visibility,
        do_not_track,
        online_status,
        history_length,
        load_time,
        orientation,
        connection_type,
        downlink,
        rtt,
        gpu_vendor,
        gpu_renderer,
        battery_level,
        battery_charging,
        ip,
        ...locationData,
        gps_location,
        has_camera,
        has_microphone,
      })
    }

    getDeviceInfo()
  }, [])

  return deviceInfo
}

export default useDeviceInfo
