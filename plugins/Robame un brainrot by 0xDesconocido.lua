-- 🟣 Auto Build Fortnite Style (Ramp + Floor plano + Invisibilidad Brainrot)
-- Con GUI en Delta / Solara / Synapse

local Players = game:GetService("Players")
local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local rootPart = character:WaitForChild("HumanoidRootPart")

-- Configuración
local buildMode = "Off" -- "Ramp" o "Floor"
local distance = 6
local buildTime = 6
local invisible = false

-- Función crear rampa (escalera amarilla)
local function createRamp()
    local ramp = Instance.new("Part")
    ramp.Size = Vector3.new(6, 1, 12)
    ramp.Anchored = true
    ramp.Color = Color3.fromRGB(255, 200, 0) -- Amarillo
    ramp.Material = Enum.Material.Neon
    ramp.CFrame = rootPart.CFrame * CFrame.new(0, 0, -distance) * CFrame.Angles(math.rad(45), 0, 0)
    ramp.Parent = workspace
    game:GetService("Debris"):AddItem(ramp, buildTime)
end

-- Función crear piso (plano verde en el suelo)
local function createFloor()
    local floor = Instance.new("Part")
    floor.Size = Vector3.new(12, 1, 12) -- Más ancho
    floor.Anchored = true
    floor.Color = Color3.fromRGB(0, 255, 100) -- Verde
    floor.Material = Enum.Material.Neon
    floor.CFrame = rootPart.CFrame * CFrame.new(0, -3, -distance)
    floor.Parent = workspace
    game:GetService("Debris"):AddItem(floor, buildTime)
end

-- Loop de construcción automática
task.spawn(function()
    while task.wait(0.4) do
        if humanoid and humanoid.MoveDirection.Magnitude > 0 then
            if buildMode == "Ramp" then
                createRamp()
            elseif buildMode == "Floor" then
                createFloor()
            end
        end
    end
end)

-- Función Invisibilidad total
local function toggleInvisibility()
    invisible = not invisible
    for _,v in pairs(character:GetDescendants()) do
        if v:IsA("BasePart") and v.Name ~= "HumanoidRootPart" then
            v.Transparency = invisible and 1 or 0
            if v:FindFirstChild("face") then
                v.face.Transparency = invisible and 1 or 0
            end
        elseif v:IsA("Decal") then
            v.Transparency = invisible and 1 or 0
        end
    end
end

-- GUI
local ScreenGui = Instance.new("ScreenGui")
local Frame = Instance.new("Frame")
local RampBtn = Instance.new("TextButton")
local FloorBtn = Instance.new("TextButton")
local InvisBtn = Instance.new("TextButton")
local CloseBtn = Instance.new("TextButton")

ScreenGui.Parent = game:GetService("CoreGui")

Frame.Size = UDim2.new(0, 220, 0, 160)
Frame.Position = UDim2.new(0.05, 0, 0.2, 0)
Frame.BackgroundColor3 = Color3.fromRGB(30, 30, 30)
Frame.BorderSizePixel = 2
Frame.Active = true
Frame.Draggable = true
Frame.Parent = ScreenGui

local function makeButton(btn, text, posY, color)
    btn.Size = UDim2.new(0, 200, 0, 30)
    btn.Position = UDim2.new(0, 10, 0, posY)
    btn.BackgroundColor3 = color
    btn.Text = text
    btn.TextColor3 = Color3.new(1,1,1)
    btn.Parent = Frame
end

makeButton(RampBtn, "🟨 Ramp (Escalera Amarilla)", 10, Color3.fromRGB(255,200,0))
makeButton(FloorBtn, "🟢 Floor (Piso Verde)", 50, Color3.fromRGB(0,255,100))
makeButton(InvisBtn, "👻 Invisibilidad", 90, Color3.fromRGB(150,150,150))
makeButton(CloseBtn, "☠️ Cerrar Script", 130, Color3.fromRGB(255,0,0))

RampBtn.MouseButton1Click:Connect(function()
    buildMode = (buildMode == "Ramp") and "Off" or "Ramp"
end)

FloorBtn.MouseButton1Click:Connect(function()
    buildMode = (buildMode == "Floor") and "Off" or "Floor"
end)

InvisBtn.MouseButton1Click:Connect(function()
    toggleInvisibility()
end)

CloseBtn.MouseButton1Click:Connect(function()
    ScreenGui:Destroy()
    buildMode = "Off"
end)

print("✅ Script cargado (Ramp, Floor plano + Invisibilidad Brainrot).")
