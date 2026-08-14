-- ============================================================================
-- AURA E-COMMERCE — SEED PRODUCT IMAGES SCRIPT
-- Database: AuraDb
-- Description: Inserts 3 ProductImage rows per existing Product in dbo.Products.
-- Exactly one image per product is marked as IsMain = 1 (bit), others IsMain = 0.
-- ============================================================================

USE [AuraDb];
GO

SET NOCOUNT ON;

BEGIN TRANSACTION;

BEGIN TRY
    -- Image 1 (Main Image)
    INSERT INTO [dbo].[ProductImages]
        ([Id], [ImageUrl], [IsMain], [ProductId], [CreatedDate], [UpdatedDate], [IsDeleted])
    SELECT 
        NEWID() AS [Id],
        'https://picsum.photos/seed/' + LOWER(CAST(p.[Id] AS NVARCHAR(36))) + '-1-main/800/800' AS [ImageUrl],
        1 AS [IsMain],
        p.[Id] AS [ProductId],
        GETUTCDATE() AS [CreatedDate],
        NULL AS [UpdatedDate],
        0 AS [IsDeleted]
    FROM [dbo].[Products] p
    WHERE NOT EXISTS (
        SELECT 1 FROM [dbo].[ProductImages] pi WHERE pi.[ProductId] = p.[Id]
    );

    -- Image 2 (Side / Angle View)
    INSERT INTO [dbo].[ProductImages]
        ([Id], [ImageUrl], [IsMain], [ProductId], [CreatedDate], [UpdatedDate], [IsDeleted])
    SELECT 
        NEWID() AS [Id],
        'https://picsum.photos/seed/' + LOWER(CAST(p.[Id] AS NVARCHAR(36))) + '-2-side/800/800' AS [ImageUrl],
        0 AS [IsMain],
        p.[Id] AS [ProductId],
        GETUTCDATE() AS [CreatedDate],
        NULL AS [UpdatedDate],
        0 AS [IsDeleted]
    FROM [dbo].[Products] p
    WHERE (SELECT COUNT(*) FROM [dbo].[ProductImages] pi WHERE pi.[ProductId] = p.[Id]) = 1;

    -- Image 3 (Detail / Close-up View)
    INSERT INTO [dbo].[ProductImages]
        ([Id], [ImageUrl], [IsMain], [ProductId], [CreatedDate], [UpdatedDate], [IsDeleted])
    SELECT 
        NEWID() AS [Id],
        'https://picsum.photos/seed/' + LOWER(CAST(p.[Id] AS NVARCHAR(36))) + '-3-detail/800/800' AS [ImageUrl],
        0 AS [IsMain],
        p.[Id] AS [ProductId],
        GETUTCDATE() AS [CreatedDate],
        NULL AS [UpdatedDate],
        0 AS [IsDeleted]
    FROM [dbo].[Products] p
    WHERE (SELECT COUNT(*) FROM [dbo].[ProductImages] pi WHERE pi.[ProductId] = p.[Id]) = 2;

    COMMIT TRANSACTION;
    PRINT 'Product images successfully seeded!';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@ErrorMessage, 16, 1);
END CATCH;
GO

-- Verification query to display seeded records
SELECT 
    p.[Name] AS ProductName,
    pi.[Id] AS ImageId,
    pi.[ImageUrl],
    pi.[IsMain]
FROM [dbo].[Products] p
JOIN [dbo].[ProductImages] pi ON p.[Id] = pi.[ProductId]
ORDER BY p.[Name], pi.[IsMain] DESC;
GO
