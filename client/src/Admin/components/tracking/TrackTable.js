import React from "react";
import { Form, Table } from "react-bootstrap";

export default function TrackTable({ children, mode }) {
  return (
    <Table responsive striped bordered hover style={{ fontSize: "0.87rem" }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Username</th>
          <th>URL</th>
          <th>Track Id</th>
          <th>Box no.</th>
          <th>น้ำหนัก</th>
          <th>Q</th>
          {mode !== "shimizu" && <th>price</th>}
          <th>point</th>
          <th>รอบเรือ</th>
          {mode !== "shimizu" && (
            <>
              <th>รูป 1</th>
              <th>รูป 2</th>
            </>
          )}
          <th>รับของ</th>
          <th>Done</th>
          <th>Noted</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  );
}
