package docker

import (
	"archive/tar"
	"bytes"
	"context"
	"io"
	"path/filepath"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/google/uuid"
)

const volumeName = "family-steam"

func getClient() (*client.Client, error) {
	return client.NewClientWithOpts(client.FromEnv)
}

func UploadFile(data []byte, fileName string) (string, error) {
	cli, err := getClient()
	if err != nil {
		return "", err
	}

	id := uuid.New().String()

	ctx := context.Background()

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "alpine",
		Cmd:   []string{"sleep", "5"},
	}, &container.HostConfig{
		Binds: []string{volumeName + ":/data"},
	}, &network.NetworkingConfig{}, nil, "")
	if err != nil {
		return "", err
	}

	containerID := resp.ID

	defer cli.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})

	err = cli.ContainerStart(ctx, containerID, container.StartOptions{})
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)

	tw.WriteHeader(&tar.Header{
		Name: filepath.Join(id, fileName),
		Mode: 0600,
		Size: int64(len(data)),
	})

	tw.Write(data)
	tw.Close()

	err = cli.CopyToContainer(ctx, containerID, "/data", &buf, container.CopyToContainerOptions{})
	if err != nil {
		return "", err
	}

	return id, nil
}

func DownloadFile(id string, fileName string) ([]byte, error) {
	cli, err := getClient()
	if err != nil {
		return nil, err
	}

	ctx := context.Background()

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "alpine",
		Cmd:   []string{"sleep", "5"},
	}, &container.HostConfig{
		Binds: []string{volumeName + ":/data"},
	}, &network.NetworkingConfig{}, nil, "")
	if err != nil {
		return nil, err
	}

	containerID := resp.ID

	defer cli.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})

	err = cli.ContainerStart(ctx, containerID, container.StartOptions{})
	if err != nil {
		return nil, err
	}

	reader, _, err := cli.CopyFromContainer(ctx, containerID, filepath.Join("/data", id, fileName))
	if err != nil {
		return nil, err
	}
	defer reader.Close()

	tr := tar.NewReader(reader)

	_, err = tr.Next()
	if err != nil {
		return nil, err
	}

	return io.ReadAll(tr)
}

func DeleteFile(id string) error {
	cli, err := getClient()
	if err != nil {
		return err
	}

	ctx := context.Background()

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "alpine",
		Cmd:   []string{"rm", "-rf", "/data/" + id},
	}, &container.HostConfig{
		Binds: []string{volumeName + ":/data"},
	}, &network.NetworkingConfig{}, nil, "")
	if err != nil {
		return err
	}

	containerID := resp.ID

	defer cli.ContainerRemove(ctx, containerID, container.RemoveOptions{Force: true})

	err = cli.ContainerStart(ctx, containerID, container.StartOptions{})
	if err != nil {
		return err
	}

	return nil
}
