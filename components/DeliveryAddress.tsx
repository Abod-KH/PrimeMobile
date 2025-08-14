"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Address } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import toast from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useUser } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";

interface Props {
  addresses: Address[] | null;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  onAddressesUpdate: () => void;
}

const DeliveryAddress = ({ addresses, selectedAddress, setSelectedAddress, onAddressesUpdate }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsLoading(true);
    try {
      // First update local state for immediate UI update
      if (addresses) {
        const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
        if (selectedAddress?._id === addressId) {
          const nextAddress = updatedAddresses[0];
          if (nextAddress) {
            setSelectedAddress(nextAddress);
          } else {
            setSelectedAddress(null);
          }
        }
      }

      // Then delete from database
      await client.delete(addressId);
      await onAddressesUpdate();
      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
      // Refresh addresses to ensure UI is in sync with database
      await onAddressesUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("Please sign in to add an address");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const addressData = {
      _type: "address" as const,
      userId: user.id,
      name: formData.get("name") as string,
      email: user?.emailAddresses[0]?.emailAddress,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: (formData.get("state") as string)?.toUpperCase(),
      zip: formData.get("zip") as string,
      default: !addresses || addresses.length === 0
    };

    try {
      const newAddress = await client.create(addressData);
      setIsDialogOpen(false);
      
      // Update local state immediately
      if (addresses) {
        if (!selectedAddress) {
          setSelectedAddress(newAddress);
        }
      }
      
      // Then fetch fresh data
      await onAddressesUpdate();
      toast.success("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
      // Refresh addresses to ensure UI is in sync with database
      await onAddressesUpdate();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md mt-5 p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Add New Address
        </Button>
      </div>

      {addresses && addresses.length > 0 ? (
        <RadioGroup
          defaultValue={addresses?.find((addr) => addr.default)?._id.toString()}
          className="space-y-4"
        >
          {addresses?.map((address) => (
            <div
              key={address?._id}
              className={`flex items-center space-x-2 p-4 border rounded-md cursor-pointer hover:border-shop_dark_green transition-colors ${
                selectedAddress?._id === address?._id ? "border-shop_dark_green bg-shop_dark_green/5" : ""
              }`}
            >
              <div className="flex-1 flex items-center space-x-2" onClick={() => setSelectedAddress(address)}>
                <RadioGroupItem value={address?._id.toString()} id={`address-${address?._id}`} />
                <Label className="flex-1 space-y-1" htmlFor={`address-${address?._id}`}>
                  <span className="font-semibold block">{address?.name}</span>
                  <span className="text-sm text-gray-600 block">
                    {address.address}, {address.city}, {address.state} {address.zip}
                  </span>
                </Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(address._id);
                }}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <p className="text-gray-500 text-center py-4">No addresses found. Add a new address to continue.</p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Address Name (e.g. Home, Work)</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" name="address" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required />
              </div>
              <div>
                <Label htmlFor="state">State (2 letters)</Label>
                <Input 
                  id="state" 
                  name="state" 
                  required 
                  maxLength={2}
                  pattern="[A-Za-z]{2}"
                  title="Two letter state code (e.g. NY, CA)"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="zip">ZIP Code</Label>
              <Input 
                id="zip" 
                name="zip" 
                required 
                pattern="\d{5}(-\d{4})?"
                title="Five digit ZIP code (optional four digit extension)"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Address"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryAddress;