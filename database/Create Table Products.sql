Create Table Products
(
  ProductId int primary key identity(1,1),
  ProductName nvarchar(50),
  ProductPrice decimal(18,2),
  ProductStock int,
  ProductCreatedDate DATETIME,
  ProductDescription nvarchar(500),
  ProductIsActıve bit



)