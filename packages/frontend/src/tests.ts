// src/test.ts
import axios from "axios";

async function testAxios() {
  try {
    const response = await axios.get("https://api.github.com");
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testAxios();
