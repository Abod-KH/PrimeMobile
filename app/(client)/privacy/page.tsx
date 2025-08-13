import Container from "@/components/Container";
import Title from "@/components/Title";

const PrivacyPolicyPage = () => {
  return (
    <Container className="mt-10">
      
      <Title>Privacy Policy</Title>
      <div className="py-10">
        <h3 className="text-xl font-semibold mb-3">1. Information Collection</h3>
        <p className="text-lg leading-relaxed mb-4">
          We collect information you provide directly to us when using our services, as well as information about your use of our services.
        </p>

        <h3 className="text-xl font-semibold mb-3">2. Use of Information</h3>
        <p className="text-lg leading-relaxed mb-4">
          We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you.
        </p>

        <h3 className="text-xl font-semibold mb-3">3. Information Sharing</h3>
        <p className="text-lg leading-relaxed mb-4">
          We do not share your personal information with third parties except as described in this Privacy Policy or with your consent.
        </p>

        <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
        <p className="text-lg leading-relaxed mb-4">
          We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.
        </p>

        <h3 className="text-xl font-semibold mb-3">5. Your Rights</h3>
        <p className="text-lg leading-relaxed mb-4">
          You have the right to access, correct, or delete your personal information. Please contact us for assistance with these requests.
        </p>
      </div>
    </Container>
  );
};

export default PrivacyPolicyPage;