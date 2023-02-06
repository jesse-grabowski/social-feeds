---
layout: default
title: Application
permalink: /architecture/application
parent: Architecture
---

# Application

## Introduction

This document describes the application point of view of the Social Feeds application.

## Not Ruled

### Points subject to further study

#### Monetization

This service is primarily for private use and won't be accepting user sign-ups in its current iteration, avoiding any need for monetization within the application itself.

### Assumptions

* Application will only be available for private use

## General Context

### Objectives

This application allows for static websites and applications to access social media feeds without requiring a custom backend to manage access tokens.

### Existing

There are competing SaaS products and CMS plugins that fulfill this purpose, but are cost prohibitive for use in small projects.

### Actors

#### Internal

##### Administrator

Provisions and manages user accounts for the application.

#### External

##### Site Owner

Provisions and manages sites. Initiates requests for social media authentication.

##### Social Media Manager

Owner of the social media accounts being managed.

##### Web Client

The website / UI consuming the exposed social media feed.

## Constraints

### Budget

* Application must fit entirely within the AWS free tier.

### Planning

* No time constraints

### Urbanization

* User authentication should be suitably abstracted such that external identity providers may be utilized in future iterations.
* All service calls must pass through an API gateway to allow for generalized security controls.

### Legal

* Application must comply with Meta, other provider TOS's.

## Requirements

* The API must be flexible enough to aggregate social media feeds from Instagram, Facebook, and Twitter at minimum.
* Access token management should require minimal user interaction, especially from the Social Media Manager, outside of initial setup.
* Access tokens must be securely stored in a vault.
