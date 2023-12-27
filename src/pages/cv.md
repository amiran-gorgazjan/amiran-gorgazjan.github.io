---
layout: base.njk
title: CV
---

# {{ title }}

<style>
    .cv-container {
        display: grid;
        grid-template-columns: 3fr 1fr 3fr;
        width: 100%;
        padding-bottom: 4rem;
    }

    .cv-bubble {
        background-color: #fff;
        border-radius: 1rem 1rem 1rem 1rem;
        padding: 1rem 1rem;
        position: relative;
    }

    .cv-bubble--blue {
        background-color: #046dc4;
    }
    .cv-bubble--green {
        background-color: #48bb78;
    }
    .cv-bubble--violet {
        background-color: #b80748;
    }

    .cv-bubble--left {
        border-top-right-radius: 0;
        transform: rotate(2deg);
    }
    .cv-bubble--right {
        border-top-left-radius: 0;
        transform: rotate(-2deg);
    }

    .cv-bubble h2 {
        margin: 0;
        font-family: 'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif;
        line-height: 2rem;
        font-size: 2rem;
        text-align: center;
    }
    .cv-bubble h3 {
        margin: 0.8rem 0 0 0;
        font-size: 1.2rem;
        font-weight: 100;
        text-align: center;
    }
    .cv-bubble p {
        margin: 1rem 0 0;
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 300;
    }
    .cv-tech {
        margin: 1rem 0 0 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
    }
    .cv-tech li {
        display: block;
        margin: 0;
        padding: 0 0.5rem;
        border-radius: 0.3rem;
        font-size: 0.8rem;
        font-weight: 300;
    }
    .cv-bubble--blue .cv-tech li {
        background-color: #003883;
    }
    .cv-bubble--violet .cv-tech li {
        background-color: #6f0d2d;
    }
    .cv-timeline-point {
        position: relative;
        width: 2rem;
        height: 100%;
        background-color: #fff;
        margin: 0 auto;
    }
    .cv-timeline-point--start {
        border-radius: 1rem 1rem 0 0;
    }
    .cv-timeline-point--blue {
        background-color: #046dc4;
    }
    .cv-timeline-point--violet {
        background-color: #b80748;
    }
</style>
<div class="cv-container">
    <div class="cv-left">
        <div class="cv-bubble cv-bubble--left cv-bubble--blue">
            <h2>Deepinsight</h2>
            <h3>Tech Lead <br /> Software Architect</h3>
            <p>
                Deepinsight started as an AI consulting company in the health sector.
                I joined them as a front end developer, but I was quickly promoted to tech lead
                where I was responsible for the architecture of the front end and the back end and
                establishing the development processes, including Agile principles and CI/CD.
            </p>
            <ul class="cv-tech">
                <li>TypeScript</li>
                <li>React</li>
                <li>Redux</li>
                <li>Zustand</li>
                <li>Next.js</li>
                <li>Puppeteer</li>
                <li>OpenAPI</li>
                <li>FHIR</li>
                <li>PostgresQL</li>
                <li>Docker</li>
                <li>Kubernetes</li>
                <li>Conda</li>
                <li>Poetry</li>
                <li>Python</li>
                <li>FastAPI</li>
                <li>Team Management</li>
            </ul>
        </div>
    </div>
    <div class="timeline">
        <div class="cv-timeline-point cv-timeline-point--start cv-timeline-point--blue">2022</div>
    </div>
    <div class="cv-right">
    </div>
    <!-- Row END -->
    <div></div>
    <div>
        <div class="cv-timeline-point cv-timeline-point--violet">2019</div>
    </div>
    <div>
        <div class="cv-bubble cv-bubble--right cv-bubble--violet">
            <h2>Block / Tidal</h2>
            <h3>Tech Lead <br /> Senior Full Stack Engineer</h3>
            <p>
                Tidal is company that aims to revolutionize the music industry by giving artists
                more control over their music and how it is distributed. I joined them as a full
                stack engineer where I was responsible for the Sign Up and Sign In flows, the
                Payment flow and promotional campaigns. Tidal was acquired by Block in 2021.
            </p>
            <ul class="cv-tech">
                <li>TypeScript</li>
                <li>Vue.js</li>
                <li>Nuxt</li>
                <li>Node</li>
                <li>OpenAPI</li>
                <li>Express</li>
                <li>DynamoDB</li>
                <li>Docker</li>
            </ul>
        </div>
    </div>
    <!-- Row END -->
    <div class="cv-left">
        <div class="cv-bubble cv-bubble--left cv-bubble--blue">
            <h2>Pipedrive</h2>
            <h3>Tech Lead <br /> Senior Full Stack Engineer</h3>
            <p>
                Pipedrive is a CRM company that helps sales teams manage their sales pipeline.
                I joined them as a full stack engineer where I was responsible for the
                the billing flow, the complete rebuild of the search engine and settings.
            </p>
            <ul class="cv-tech">
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>Node</li>
                <li>React</li>
                <li>Redux</li>
                <li>Jasmine</li>
                <li>OpenAPI</li>
                <li>Kafka</li>
                <li>ElasticSearch</li>
                <li>MySQL</li>
                <li>Docker</li>
                <li>AWS S3</li>
                <li>RabbitMQ</li>
                <li>Team Management</li>
            </ul>
        </div>
    </div>
    <div class="timeline">
        <div class="cv-timeline-point cv-timeline-point--blue">2022</div>
    </div>
    <div class="cv-right">
    </div>
    <!-- Row END -->
    <div></div>
    <div>
        <div class="cv-timeline-point cv-timeline-point--violet">2019</div>
    </div>
    <div>
        <div class="cv-bubble cv-bubble--right cv-bubble--violet">
            <h2>ZeroTurnaround</h2>
            <h3>Senior JavaScript Developer</h3>
            <p>
                ZeroTurnaround is a company that builds tools for Java developers.
                I joined them as a front end developer where I was responsible for the
                complete rebuild of the front end of the XRebel product.
            </p>
            <ul class="cv-tech">
                <li>AngluarJS</li>
                <li>jQuery</li>
                <li>React</li>
            </ul>
        </div>
    </div>
    <!-- Row END -->
    <div class="cv-left">
        <div class="cv-bubble cv-bubble--left cv-bubble--blue">
            <h2>The Estonian Environment Agency</h2>
            <h3>Tech Lead <br /> Senior Full Stack Engineer</h3>
            <p>
                The Estonian Environment Agency is a government agency that is responsible for
                monitoring the environment and providing environmental information.
                I joined them as a full stack engineer where I was responsible for the
                complete rebuild of their webside <a href="https://www.ilmateenistus.ee/">ilmateenistus.ee</a>.
            </p>
            <ul class="cv-tech">
                <li>Wordpress</li>
                <li>PHP</li>
                <li>JavaScript</li>
                <li>jQuery</li>
            </ul>
        </div>
    </div>
    <div class="timeline">
        <div class="cv-timeline-point cv-timeline-point--blue">2022</div>
    </div>
    <div class="cv-right">
    </div>
    <!-- Row END -->
    <div></div>
    <div>
        <div class="cv-timeline-point cv-timeline-point--violet">2019</div>
    </div>
    <div>
        <div class="cv-bubble cv-bubble--right cv-bubble--violet">
            <h2>Kooliksvalmis Project</h2>
            <h3>Senior JavaScript Developer <br/> Team Lead</h3>
            <p>
                I worked together with the company Povi to build a fun and
                educational web game portal aimed at preschool children called
                <a href="https://kooliksvalmis.ee/">kooliksvalmis.ee</a>.
            </p>
            <ul class="cv-tech">
                <li>JavaScript</li>
                <li>jQuery</li>
                <li>Game Development</li>
                <li>MelonJS</li>
                <li>PHP</li>
                <li>Drupal</li>
                <li>React</li>
            </ul>
        </div>
    </div>
    <!-- Row END -->
    <div class="cv-left">
        <div class="cv-bubble cv-bubble--left cv-bubble--blue">
            <h2>Vigvam</h2>
            <h3>Senior Full Stack Engineer</h3>
            <p>
                Vigvam was a web agency that built websites for small and medium sized companies.
            </p>
            <ul class="cv-tech">
                <li>Wordpress</li>
                <li>PHP</li>
                <li>JavaScript</li>
                <li>jQuery</li>
            </ul>
        </div>
    </div>
    <div class="timeline">
        <div class="cv-timeline-point cv-timeline-point--blue">2022</div>
    </div>
    <div class="cv-right">
    </div>
</div>
