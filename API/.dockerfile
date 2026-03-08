# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Project fayllarını kopyala
COPY ./Capital.API/*.csproj ./Capital.API/
COPY ./Capital.DAL/*.csproj ./Capital.DAL/
COPY ./Capital.Domain/*.csproj ./Capital.Domain/

# NuGet paketlərini restore et
RUN dotnet restore ./Capital.API/Capital.API.csproj

# Bütün layihəni kopyala
COPY . .

# Publish (Release)
RUN dotnet publish ./Capital.API/Capital.API.csproj -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Publish edilmiş faylları kopyala
COPY --from=build /app/publish .

# Portu expose et
EXPOSE 80
EXPOSE 443

# App-i run et
ENTRYPOINT ["dotnet", "Capital.API.dll"]