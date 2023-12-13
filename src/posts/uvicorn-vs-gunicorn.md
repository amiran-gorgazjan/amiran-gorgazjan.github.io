---
layout: base.njk
title: Measuring Gunicorn, Uvicorn and Multiple Containers serving FastAPI
Published: Created
Updated: Last Modified
---

# {{ title }}

## Introduction

I've recently been on a fascinating journey over at [Deepinsight](https://deepinsight.io/), exploring the intricacies of server setups for FastAPI to improve performance for our [database synchronization over RestAPI](/posts/signal-based-entity-system/). If you've ever scratched your head wondering whether to go with Gunicorn and Uvicorn workers, Uvicorn with threads, or multiple containers, you're not alone. We were there too, especially puzzled by why Uvicorn is often recommended for development but not for production, and why multiple containers might be a better bet than several Gunicorn processes with multiple cores.

## Why we dived in

Let's face it, the documentation out there can be a bit thin on the ground. So, we rolled up our sleeves to find some real-world answers. We wanted to share our discoveries with you, especially focusing on the parallel request performance of these setups.