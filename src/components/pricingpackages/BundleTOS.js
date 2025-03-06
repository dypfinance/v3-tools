import React from "react";

const BundleTOS = () => {
  return (
    <div className="container-lg">
      <h6 className="launchpad-hero-title text-white mb-4">Bundles Terms of Service</h6>
      <div className="purple-wrapper d-flex flex-column gap-3 p-3">
        <p className="disclaimer-bold">1. Token Locking</p>
        <ul style={{ listStyle: "inside" }}>
          <li className="disclaimer-text">
            Once you deposit the required <b>DYP tokens</b>, they will be
            securely locked in a <b>smart contract</b> for the specified period:
            <ul style={{ listStyle: "inside", marginLeft: "15px" }}>
              <li className="disclaimer-text">
                Basic Plan: <b>3 months</b>
              </li>
              <li className="disclaimer-text">
                Advanced Plan: <b>6 months</b>
              </li>
              <li className="disclaimer-text">
                Enterprise Plan: <b>12 months</b>
              </li>
            </ul>
          </li>
          <li className="disclaimer-text">
            Tokens will be released with a 6 months linear vesting after the end
            of the lock period.
          </li>
        </ul>
        <p className="disclaimer-bold">2. Initiation Process</p>
        <ul style={{ listStyle: "inside" }}>
          <li className="disclaimer-text">
            After locking your DYP tokens, a <b>contact form</b> will appear.
            You must complete the form to initiate collaboration with our team.
          </li>
        </ul>
        <p className="disclaimer-bold">3. Service Scope</p>
        <ul style={{ listStyle: "inside" }}>
          <li className="disclaimer-text">
            Each bundle includes a predefined list of services. Any{" "}
            <b>additional features</b> or custom requests beyond the selected
            plan will incur an <b>extra cost</b>.
          </li>
          <li className="disclaimer-text">
            Any custom features will require a separate quote and agreement.
          </li>
        </ul>
        <p className="disclaimer-bold">4. Ethical Project Guidelines</p>
        <ul style={{ listStyle: "inside" }}>
          <li className="disclaimer-text">
            We are committed to building <b>ethical and impactful projects</b>.
          </li>
          <li className="disclaimer-text">
            Projects involving illegal, harmful, or unethical activities will be{" "}
            <b>rejected</b>, and no support will be provided.
          </li>
          <li className="disclaimer-text">
            If a project is flagged post-initiation, services may be terminated
            at our discretion.
          </li>
        </ul>
        <p className="disclaimer-bold">5. Communication and Updates</p>
        <ul style={{ listStyle: "inside" }}>
          <li className="disclaimer-text">
            You will receive <b>regular updates</b> on your project’s progress
            throughout the development process
          </li>
          <li className="disclaimer-text">
            Timelines will be agreed upon during the initiation phase and depend
            on project complexity.
          </li>
        </ul>
        <p className="disclaimer-bold">6. Liability Disclaimer</p>
        <ul style={{ listStyle: "inside" }}>
          <li className="disclaimer-text">
            While we strive to deliver high-quality results, we do not guarantee
            outcomes such as user adoption, market performance, or
            profitability.
          </li>
          <li className="disclaimer-text">
            Dypius will not be held liable for any losses arising from your use
            of the services provided.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BundleTOS;
