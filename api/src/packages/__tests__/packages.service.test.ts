import type { Package } from "@common/types/packages/package.types";
import type { Sql } from "postgres";
import type { IPackagesRepository } from "../packages.repository";
import {
  createPackage,
  setPackageDelivered,
  setPackageInTransit,
  setPackageReadyForShipping,
  setPackageReturnedToWarehouse,
} from "../packages.service";

// Mock the database module
jest.mock("../../config/database", () => ({
  __esModule: true,
  default: {
    begin: jest.fn(),
  },
}));

// Mock the helper
jest.mock("../packages.helper", () => ({
  generateTrackingNumber: jest.fn(() => "TEST-TRACKING-123"),
}));

import pgsql from "../../config/database";

describe("Packages Service (Refactored)", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockBegin = pgsql.begin as any as jest.MockedFunction<
    <T>(callback: (sql: Sql) => Promise<T>) => Promise<T>
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPackage", () => {
    it("should create a package when product is available", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn().mockResolvedValue({ available: true }),
        createPackage: jest.fn().mockResolvedValue({
          id: 1,
          tracking_number: "TEST-TRACKING-123",
          user_id: 1,
          destination_address: "123 Main St",
          status: "pending",
        } as Package),
        addPackageProduct: jest.fn().mockResolvedValue(undefined),
        addShipmentHistory: jest.fn().mockResolvedValue(undefined),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn(),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = {} as Sql;
        return await callback(mockSql);
      });

      const result = await createPackage(
        1,
        "123 Main St",
        1,
        "Test notes",
        mockRepository
      );

      expect(result.tracking_number).toBe("TEST-TRACKING-123");
      expect(mockRepository.findAvailableProduct).toHaveBeenCalledWith(
        expect.anything(),
        1
      );
      expect(mockRepository.createPackage).toHaveBeenCalledWith(
        expect.anything(),
        "TEST-TRACKING-123",
        1,
        "123 Main St"
      );
      expect(mockRepository.addPackageProduct).toHaveBeenCalledWith(
        expect.anything(),
        1,
        1,
        1
      );
      expect(mockRepository.addShipmentHistory).toHaveBeenCalled();
    });

    it("should throw error when product is not available", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn().mockResolvedValue({ available: false }),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn(),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn(),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = {} as Sql;
        return await callback(mockSql);
      });

      await expect(
        createPackage(1, "123 Main St", 1, undefined, mockRepository)
      ).rejects.toThrow("Product is not available");

      expect(mockRepository.createPackage).not.toHaveBeenCalled();
    });
  });

  describe("setPackageReadyForShipping", () => {
    it("should mark package as ready when in pending status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn().mockResolvedValue(undefined),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue({
          id: 1,
          tracking_number: "TEST-123",
          status: "ready_for_shipping",
          destination_address: "123 Main St",
        } as Package),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        // Mock the SELECT query
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "pending",
            destination_address: "123 Main St",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      const result = await setPackageReadyForShipping(
        "TEST-123",
        1,
        mockRepository
      );

      expect(result.status).toBe("ready_for_shipping");
      expect(mockRepository.updatePackageStatus).toHaveBeenCalledWith(
        expect.anything(),
        1,
        "pending",
        "ready_for_shipping"
      );
    });

    it("should throw error when package is not in pending status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn(),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue(null), // Status check failed
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "in_transit", // Wrong status
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      await expect(
        setPackageReadyForShipping("TEST-123", 1, mockRepository)
      ).rejects.toThrow(
        "Package cannot be marked as ready - it must be in pending status"
      );
    });
  });

  describe("setPackageInTransit", () => {
    it("should mark package as in transit when in ready_for_shipping status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn().mockResolvedValue(undefined),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue({
          id: 1,
          tracking_number: "TEST-123",
          status: "in_transit",
          destination_address: "123 Main St",
        } as Package),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "ready_for_shipping",
            destination_address: "123 Main St",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      const result = await setPackageInTransit("TEST-123", 1, mockRepository);

      expect(result.status).toBe("in_transit");
      expect(mockRepository.updatePackageStatus).toHaveBeenCalledWith(
        expect.anything(),
        1,
        "ready_for_shipping",
        "in_transit",
        expect.any(Date)
      );
    });

    it("should throw error when package is not in ready_for_shipping status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn(),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue(null),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "pending",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      await expect(
        setPackageInTransit("TEST-123", 1, mockRepository)
      ).rejects.toThrow(
        "Package cannot be marked as in transit - it must be in ready_for_shipping status"
      );
    });
  });

  describe("setPackageDelivered", () => {
    it("should mark package as delivered when in in_transit status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn().mockResolvedValue(undefined),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue({
          id: 1,
          tracking_number: "TEST-123",
          status: "delivered",
          destination_address: "123 Main St",
        } as Package),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "in_transit",
            destination_address: "123 Main St",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      const result = await setPackageDelivered("TEST-123", 1, mockRepository);

      expect(result.status).toBe("delivered");
      expect(mockRepository.updatePackageStatus).toHaveBeenCalledWith(
        expect.anything(),
        1,
        "in_transit",
        "delivered",
        undefined,
        expect.any(Date)
      );
    });

    it("should throw error when package is not in in_transit status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn(),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue(null),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "pending",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      await expect(
        setPackageDelivered("TEST-123", 1, mockRepository)
      ).rejects.toThrow(
        "Package cannot be marked as delivered - it must be in in_transit status"
      );
    });
  });

  describe("setPackageReturnedToWarehouse", () => {
    it("should return package to warehouse when in in_transit status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn().mockResolvedValue(undefined),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue({
          id: 1,
          tracking_number: "TEST-123",
          status: "ready_for_shipping",
          destination_address: "123 Main St",
        } as Package),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "in_transit",
            destination_address: "123 Main St",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      const result = await setPackageReturnedToWarehouse(
        "TEST-123",
        1,
        mockRepository
      );

      expect(result.status).toBe("ready_for_shipping");
      expect(mockRepository.updatePackageStatus).toHaveBeenCalledWith(
        expect.anything(),
        1,
        "in_transit",
        "ready_for_shipping"
      );
    });

    it("should throw error when package is not in in_transit status", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn(),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue(null),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValueOnce([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "pending",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      await expect(
        setPackageReturnedToWarehouse("TEST-123", 1, mockRepository)
      ).rejects.toThrow(
        "Package cannot be returned to warehouse - it must be in in_transit status"
      );
    });
  });

  describe("State Transition Rules", () => {
    it("should enforce that packages cannot skip states", async () => {
      const mockRepository: IPackagesRepository = {
        findAvailableProduct: jest.fn(),
        createPackage: jest.fn(),
        addPackageProduct: jest.fn(),
        addShipmentHistory: jest.fn(),
        findPackageByIdForUpdate: jest.fn(),
        updatePackageStatus: jest.fn().mockResolvedValue(null),
      };

      mockBegin.mockImplementation(async (callback) => {
        const mockSql = jest.fn();
        mockSql.mockResolvedValue([
          {
            id: 1,
            tracking_number: "TEST-123",
            status: "pending",
          },
        ]);
        return await callback(mockSql as unknown as Sql);
      });

      // Can't deliver a pending package
      await expect(
        setPackageDelivered("TEST-123", 1, mockRepository)
      ).rejects.toThrow();

      // Can't mark as in transit from pending
      await expect(
        setPackageInTransit("TEST-123", 1, mockRepository)
      ).rejects.toThrow();
    });
  });
});
