FunctionCode: |
  function handler(event) {
      var response = event.response;
      var headers = response.headers;
      headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubdomains; preload'}; 
      headers['content-security-policy'] = { value: "default-src 'none'; font-src https://*.cloudfront.net data:; img-src 'self' data:; script-src 'self';manifest-src 'self'; style-src 'unsafe-inline' 'self'; style-src-elem 'unsafe-inline' 'self'; object-src 'none'; connect-src https://*.amazonaws.com"}; 
      headers['x-content-type-options'] = { value: 'nosniff'}; 
      headers['x-frame-options'] = {value: 'DENY'}; 
      headers['x-xss-protection'] = {value: '1; mode=block'}; 
      headers['referrer-policy'] = {value: 'same-origin'}
     return response;
  }

