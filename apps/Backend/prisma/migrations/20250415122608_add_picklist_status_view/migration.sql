-- This is an empty migration.

-- Create a view that joins Picklist and Order with status
CREATE VIEW "picklist_with_status" AS
SELECT
  p.*,
  o.status AS order_status
FROM
  "Picklist" p
JOIN
  "Order" o ON o."picklistId" = p.id;
