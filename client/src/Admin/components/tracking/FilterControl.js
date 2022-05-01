import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function FilterControl({
  paginate,
  setPaginate,
  handleChange,
  FetchTrackings,
}) {
  const handleSearch = () => {
    FetchTrackings();
  };
  return (
    <Row className="mb-2">
      <Col lg={2}>
        <Form.Group className="mb-3">
          <Form.Label>Date&nbsp;</Form.Label>
          <Form.Control type="date" name="date" onChange={handleChange} />
        </Form.Group>
      </Col>
      <Col lg={2}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            onChange={handleChange}
            placeholder="Enter Username"
          />
        </Form.Group>
      </Col>
      <Col lg={2}>
        <Form.Group className="mb-3">
          <Form.Label>Track Id</Form.Label>
          <Form.Control
            type="text"
            name="trackId"
            onChange={handleChange}
            placeholder="Enter Track Id"
          />
        </Form.Group>
      </Col>
      <Col lg={2}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>รอบเรือ&nbsp;</Form.Label>
          <Form.Control type="date" name="roundBoat" onChange={handleChange} />
        </Form.Group>
      </Col>
      <Col lg={2}>
        <Form.Group className="mb-3">
          <Form.Label>Sort</Form.Label>
          <Form.Select name="orderBy" onChange={handleChange}>
            <option value="0">new(วันที่)</option>
            <option value="1">old(วันที่)</option>
            <option value="2">new(รอบเรือ)</option>
            <option value="3">old(รอบเรือ)</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={1}>
        <Form.Group className="mb-3">
          <Form.Label>แสดง</Form.Label>
          <Form.Select
            onChange={(e) => setPaginate({ ...paginate, item: e.target.value })}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col lg={1}>
        <div className="d-grid mt-sm-4">
          <Button variant="secondary" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </Col>
    </Row>
  );
}
