# smart-cctv

# Smart CCTV – AI-Based Crowd Monitoring and Stampede Prevention System

Smart CCTV is an intelligent surveillance system designed to monitor crowd density in real time and help prevent dangerous situations such as stampedes or uncontrolled crowd gatherings in public places. The system combines Artificial Intelligence, Computer Vision, and Embedded Systems to analyze live video feeds and automatically notify authorities when crowd density crosses safe limits.

The project is built using a Raspberry Pi 5, a camera module, and a GSM communication module to create a compact and efficient edge-computing surveillance device capable of running AI models locally. Instead of relying only on manual monitoring, this system continuously analyzes video streams and detects the number of people and the density of a crowd at a particular location using computer vision techniques.

The AI model processes frames from the camera and estimates the crowd density within the monitored area. Based on the analysis, the system categorizes the crowd situation into different levels such as normal, increasing density, and high-risk density.

One of the key features of the system is its multi-level alert mechanism. When the crowd density gradually increases, the system sends alerts to different levels of authorities step by step, allowing preventive measures to be taken before the situation becomes critical. If the system detects a sudden and abnormal spike in crowd density, which may indicate a potential stampede risk, it immediately triggers emergency notifications through the GSM module to inform responsible officials and emergency response teams.

Running the AI processing directly on the edge device reduces latency and ensures that alerts are generated in real time without depending heavily on cloud infrastructure. This makes the system suitable for deployment in locations where immediate action is required.

The project demonstrates how embedded hardware, artificial intelligence, and smart communication systems can be integrated to build a proactive public safety solution capable of monitoring large gatherings and preventing crowd disasters.

Such systems can be extremely useful in high-density public environments, where traditional surveillance systems often fail to detect dangerous crowd buildup until it is too late.
