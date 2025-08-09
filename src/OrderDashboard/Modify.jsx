import React, { useEffect, useState } from "react";
import { Card, Input, Button, message, Row, Col, Select } from "antd";
import axios from "axios";
import { apiUrl } from "../utils/utils";

const Modify = ({ orderId }) => {
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [oldCareLevel, setOldCareLevel] = useState("");
  const [oldIpBlockSize, setOldIpBlockSize] = useState("");
  const [newCareLevel, setNewCareLevel] = useState("");
  const [newIpBlockSize, setNewIpBlockSize] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl()}orderstatus/status-checker/${orderId}`
        );
        const characteristics =
          response.data.data?.productOrderItem?.[0]?.product
            ?.productCharacteristic || [];

        setProductId(
          response.data.data?.productOrderItem?.[0]?.product?.id || ""
        );

        const getValue = (name) =>
          characteristics.find((item) => item.name === name)?.value || "";

        setOldCareLevel(getValue("careLevel"));
        setOldIpBlockSize(getValue("ipBlockSize"));
      } catch (err) {
        message.error("Failed to fetch existing order data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  const handleModifyCareLevel = async () => {
    try {
      await axios.post(`${apiUrl()}orderstatus/modifyCareLevel`, {
        productId: productId,
        newCareLevel: newCareLevel,
      });
      message.success("Care Level updated successfully");
    } catch (err) {
      message.error("Failed to update Care Level");
    }
  };

  const handleModifyIpBlockSize = async () => {
    try {
      await axios.post(`${apiUrl()}orderstatus/modifyIP`, {
        productId: productId,
        newIpBlockSize: newIpBlockSize,
      });
      message.success("IP Block Size updated successfully");
    } catch (err) {
      message.error("Failed to update IP Block Size");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="Care Level" bordered>
          <p>
            <strong>Product ID:</strong> {productId}
          </p>
          <p>
            <strong>Old Care Level:</strong> {oldCareLevel}
          </p>
          <Input
            placeholder="Enter new Care Level"
            value={newCareLevel}
            onChange={(e) => setNewCareLevel(e.target.value)}
            className="mb-2"
          />
          <Button type="primary" onClick={handleModifyCareLevel}>
            Modify
          </Button>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="IP Block Size" bordered>
          <p>
            <strong>Product ID:</strong> {productId}
          </p>
          <p>
            <strong>Old IP Block Size:</strong> {oldIpBlockSize}
          </p>
          <Select
            placeholder="Select new IP Block Size"
            value={newIpBlockSize}
            onChange={(value) => setNewIpBlockSize(value)}
            className="mb-2 w-full"
          >
            <Select.Option value="Dynamic IP">Dynamic IP</Select.Option>
            <Select.Option value="Static IP - 1">Static IP - 1</Select.Option>
            <Select.Option value="Static IP - 4">Static IP - 4</Select.Option>
            <Select.Option value="Static IP - 8">Static IP - 8</Select.Option>
          </Select>

          <Button type="primary" onClick={handleModifyIpBlockSize}>
            Modify
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default Modify;
