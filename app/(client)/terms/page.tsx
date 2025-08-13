import Container from "@/components/Container";
import Title from "@/components/Title";

const Terms = () => {
  return (
    <Container className="mt-10">
      
      <Title>Terms and Conditions</Title>
      <div className="py-10">
        <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
        <p className="text-lg leading-relaxed mb-4">
          By accessing and using Shopcart's services, you agree to be bound by these Terms and Conditions.
        </p>

        <h3 className="text-xl font-semibold mb-3">2. Use of Services</h3>
        <p className="text-lg leading-relaxed mb-4">
          You agree to use Shopcart's services only for lawful purposes and in accordance with these Terms and Conditions.
        </p>

        <h3 className="text-xl font-semibold mb-3">3. Intellectual Property</h3>
        <p className="text-lg leading-relaxed mb-4">
          All content and materials available on Shopcart's services are the property of Shopcart and are protected by applicable intellectual property laws.
        </p>

        <h3 className="text-xl font-semibold mb-3">4. Limitation of Liability</h3>
        <p className="text-lg leading-relaxed mb-4">
          Shopcart shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of our services.
        </p>

        <h3 className="text-xl font-semibold mb-3">5. Governing Law</h3>
        <p className="text-lg leading-relaxed mb-4">
          These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Shopcart operates.
        </p>
      </div>
    </Container>
  );
};

export default Terms;