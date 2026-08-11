# ---- Build Stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files first (для layer caching)
COPY Aura.Core/Aura.Core.csproj Aura.Core/
COPY Aura.Database/Aura.Database.csproj Aura.Database/
COPY Project.Aura/Aura.Application/Aura.Application.csproj Project.Aura/Aura.Application/
COPY Project.Aura/Aura.API/Aura.API.csproj Project.Aura/Aura.API/

RUN dotnet restore Project.Aura/Aura.API/Aura.API.csproj

# Copy everything else
COPY . .

WORKDIR /src/Project.Aura/Aura.API
RUN dotnet publish -c Release -o /app/publish

# ---- Runtime Stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Aura.API.dll"]